import React from 'react';
import { Breadcrumb, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

const CustomBreadcrumb = ({ backLink, items, rightActionLink, rightActionText }) => {
  return (
    <div className="siteBreadcrumbs">
      <Container>
        <Row>
          <Col>
            <Breadcrumb>
              {backLink && (
                <li className="backLink">
                  <Link to={backLink}><IoIosArrowBack /></Link>
                </li>
              )}
              {items.map((item, index) => (
                item.active ? (
                  <Breadcrumb.Item key={index} active>
                    {item.label}
                  </Breadcrumb.Item>
                ) : (
                  <Breadcrumb.Item key={index} linkAs={Link} linkProps={{ to: item.link }}>
                    {item.label}
                  </Breadcrumb.Item>
                )
              ))}
            </Breadcrumb>
          </Col>
          {rightActionLink && rightActionText && (
            <Col className='bradcumbScreenActions'>
              <Link className='btn-primary btn' to={rightActionLink}>{rightActionText}</Link>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default CustomBreadcrumb;
